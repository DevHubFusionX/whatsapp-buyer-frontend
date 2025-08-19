// Web Share API with fallback to clipboard
export const shareContent = async (data) => {
  const { title, text, url } = data
  
  // Check if Web Share API is supported
  if (navigator.share && navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data)
      return { success: true, method: 'native' }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' }
      }
      // Fall through to clipboard fallback
    }
  }
  
  // Fallback to clipboard
  try {
    const shareText = `${title}\n${text}\n${url}`
    await navigator.clipboard.writeText(shareText)
    return { success: true, method: 'clipboard' }
  } catch (error) {
    return { success: false, error: 'Failed to copy to clipboard' }
  }
}

// Share product
export const shareProduct = async (product, storeUrl) => {
  const productUrl = `${window.location.origin}/product/${product._id}`
  return shareContent({
    title: product.name,
    text: `Check out ${product.name} for ₦${product.price?.toLocaleString()}`,
    url: productUrl
  })
}

// Share store
export const shareStore = async (vendor) => {
  const storeUrl = `${window.location.origin}/store/${vendor._id}`
  return shareContent({
    title: vendor.businessName,
    text: `Check out ${vendor.businessName}'s store`,
    url: storeUrl
  })
}