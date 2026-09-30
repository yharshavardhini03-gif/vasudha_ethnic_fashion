import os
import uuid
import logging
from typing import Tuple
from fastapi import UploadFile, HTTPException, status
from PIL import Image
import io
from app.config import settings

logger = logging.getLogger(__name__)

MIME_EXT_MAP = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
}


class StorageService:
    @staticmethod
    async def save_product_image(file: UploadFile) -> str:
        """
        Validate and save an uploaded product image.
        Returns the web-accessible URL path.
        """
        # 1. Validate MIME type
        if file.content_type not in settings.ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image format: {file.content_type}. Accepted formats: JPEG, PNG, WEBP."
            )

        # 2. Read bytes and check size
        contents = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # 3. Verify that image is valid using Pillow
        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Corrupted or invalid image file."
            )

        # 4. Generate safe unique filename
        ext = MIME_EXT_MAP.get(file.content_type, "jpg")
        filename = f"prod_{uuid.uuid4().hex[:12]}.{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)

        # 5. Write to storage
        with open(filepath, "wb") as f:
            f.write(contents)

        logger.info(f"✓ Saved product image to {filepath}")
        return f"/uploads/products/{filename}"


storage_service = StorageService()
