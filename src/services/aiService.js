/**
 * VasudhaEthnic AI Shopping Assistant Service
 * 
 * Synchronized with live FastAPI RAG pipeline + Local Ollama / Sentence-Transformers.
 * Zero external AI API keys required.
 */

import { api } from './api';

let currentSessionId = `sess_${Date.now()}`;

export const aiService = {
  /**
   * Send a query to Vasudha AI styling assistant
   * @param {string} message - User query
   * @param {Array} conversationHistory - Past conversation turns
   * @param {Array} catalog - Live products catalog from ProductContext (fallback)
   * @returns {Promise<{ answer: string, products: Array, suggestions: Array }>}
   */
  async ask(message, conversationHistory = [], catalog = []) {
    // 1. Primary: Query Local RAG Pipeline on FastAPI backend
    try {
      const response = await api.ai.chat(message, currentSessionId, conversationHistory);
      if (response && response.answer) {
        if (response.session_id) {
          currentSessionId = response.session_id;
        }
        return {
          answer: response.answer,
          products: response.products || [],
          suggestions: response.suggestions || []
        };
      }
    } catch (err) {
      console.warn('[Vasudha AI] Backend RAG server offline, falling back to local boutique stylist engine:', err.message);
    }

    // 2. Intelligent Graceful Client-Side Fallback Engine
    await new Promise((resolve) => setTimeout(resolve, 300));

    const lowerQuery = message.toLowerCase().trim();

    // Security injection check
    const isSecurity = /ignore\s+(all\s+)?(previous|prior|above)\s+instructions|system\s+prompt|database\s+password|reveal\s+secret/i.test(lowerQuery);
    if (isSecurity) {
      return {
        answer: "Namaste! 🙏 I am Vasudha AI, your personal ethnic fashion concierge. I am here exclusively to help you find royal sarees, handcrafted lehengas, kurtis, and wedding ensembles from our boutique.",
        products: [],
        suggestions: ["Show wedding sarees", "Explore kurtis under ₹3000", "Check lehengas in size M"]
      };
    }

    // Off-topic guard
    const isOffTopic = /^(what\s+is|what's|tell\s+me)\s+(my\s+name|your\s+creator)|^who\s+am\s+i|^who\s+is\s+(elon|trump|biden|modi|the\s+president)|tell\s+me\s+a\s+joke|write\s+(python|code|script)|what\s+is\s+2\s*\+\s*2|explain\s+(physics|quantum)|what('s|\s+is)\s+the\s+weather|tell\s+me\s+a\s+story/i.test(lowerQuery);
    if (isOffTopic) {
      return {
        answer: "I'm the VasudhaEthnic shopping assistant. I can only help with products, prices, availability, orders, delivery, and information available on this website.",
        products: [],
        suggestions: ["Show wedding sarees", "Explore kurtis under ₹3000", "Check lehengas in size M"]
      };
    }

    // Store policy checks
    if (/\b(delivery|shipping|courier|dispatch|timeline)\b/i.test(lowerQuery)) {
      return {
        answer: "Namaste! 🙏 We offer free express shipping on all orders across India, delivered within 4 to 5 business days with tracked courier delivery.",
        products: [],
        suggestions: ["Show wedding sarees", "Find outfits under ₹3000"]
      };
    }

    if (/\b(return|returns|exchange|refund)\b/i.test(lowerQuery)) {
      return {
        answer: "Namaste! 🙏 We offer a 7-day hassle-free return and exchange policy for unworn items with original boutique tags intact.",
        products: [],
        suggestions: ["Show wedding sarees", "Find outfits under ₹3000"]
      };
    }

    // Specific product match
    const matchedByName = catalog.filter((p) => {
      const pNameLower = p.name.toLowerCase();
      if (lowerQuery.includes(pNameLower)) return true;
      const words = pNameLower.split(/\s+/).filter((w) => w.length > 3);
      const matches = words.filter((w) => lowerQuery.includes(w));
      return matches.length >= 2;
    });

    // Extract size
    let targetSize = null;
    const sizeMatches = lowerQuery.match(/\b(?:in\s+|size\s+|size:\s*)?(xs|s|m|l|xl|xxl|free\s*size)\b/i);
    if (sizeMatches) {
      targetSize = sizeMatches[1].toUpperCase().replace(/\s+/g, ' ');
    }

    // Extract price
    let maxPrice = Infinity;
    const priceMatch = lowerQuery.match(/(?:under|below|less than|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }

    // Extract category
    let targetCategory = null;
    if (lowerQuery.includes('half saree')) {
      targetCategory = 'Half Sarees';
    } else if (lowerQuery.includes('saree') || lowerQuery.includes('sari')) {
      targetCategory = 'Sarees';
    } else if (lowerQuery.includes('lehenga') || lowerQuery.includes('choli')) {
      targetCategory = 'Lehengas';
    } else if (lowerQuery.includes('anarkali') || lowerQuery.includes('dress') || lowerQuery.includes('gown')) {
      targetCategory = 'Dresses';
    } else if (lowerQuery.includes('churidar') || lowerQuery.includes('kurti') || lowerQuery.includes('kurta') || lowerQuery.includes('tunic')) {
      targetCategory = 'Kurtis';
    }

    if (matchedByName.length > 0) {
      const prod = matchedByName[0];
      if (targetSize) {
        let sizeVariantStock = 0;
        if (prod.variants && prod.variants.length > 0) {
          const matchingVariants = prod.variants.filter(
            (v) => v.size.toUpperCase() === targetSize.toUpperCase() && v.stock > 0
          );
          sizeVariantStock = matchingVariants.reduce((sum, v) => sum + v.stock, 0);
        } else {
          const hasSize = prod.sizes?.some((s) => s.toUpperCase() === targetSize.toUpperCase() || s.toLowerCase().includes('free'));
          sizeVariantStock = hasSize ? prod.stock : 0;
        }

        if (sizeVariantStock > 0) {
          return {
            answer: `Namaste! 🙏 Yes, the **${prod.name}** is currently available in **Size ${targetSize}** (${sizeVariantStock} units ready in live boutique stock). Priced at ₹${prod.price.toLocaleString('en-IN')}.`,
            products: [prod],
            suggestions: [`Add ${prod.name} to bag`, `What colors are available?`, `Show other ${prod.category}`]
          };
        } else {
          return {
            answer: `Namaste! 🙏 The **${prod.name}** is currently out of stock in **Size ${targetSize}**. However, you may explore these available designs:`,
            products: [prod],
            suggestions: [`Check other sizes in ${prod.name}`, `Explore all ${prod.category}`]
          };
        }
      }

      return {
        answer: `Here are the verified details for **${prod.name}**: Handcrafted in pure ${prod.fabric || 'silk'}, priced at ₹${prod.price.toLocaleString('en-IN')}, available in (${prod.sizes?.join(', ') || 'Free Size'}). Live stock: ${prod.stock} units.`,
        products: [prod],
        suggestions: [`Is size M available?`, `Add to bag`, `View delivery timeline`]
      };
    }

    // Filter catalog
    let filtered = catalog.filter((product) => {
      if (product.published === false) return false;
      if (product.price > maxPrice) return false;
      if (targetCategory && product.category !== targetCategory && product.subCategory !== targetCategory) return false;
      if (targetSize) {
        const hasSize = product.sizes?.some(
          (s) => s.toUpperCase() === targetSize.toUpperCase() || s.toLowerCase().includes('free')
        );
        if (!hasSize) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      filtered = catalog.slice(0, 3);
    } else {
      filtered = filtered.slice(0, 4);
    }

    let answer = "";
    if (targetCategory && maxPrice < Infinity) {
      answer = `Namaste! 🙏 I found ${filtered.length} exquisite ${targetCategory} under ₹${maxPrice.toLocaleString('en-IN')} from our VasudhaEthnic collection:`;
    } else if (targetSize) {
      answer = `Namaste! 🙏 Here are our finest royal handcrafted designs currently available in **Size ${targetSize}**:`;
    } else {
      answer = `Namaste! 🙏 I have selected these handcrafted designs from our verified boutique catalog:`;
    }

    return {
      answer,
      products: filtered,
      suggestions: [
        "Find a wedding outfit under ₹3000",
        "Show me half sarees in size M",
        "What is available in cotton?"
      ]
    };
  }
};
