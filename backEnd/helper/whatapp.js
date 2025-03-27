export const sendWhatapp = async (calldata) => {
  const phoneNumber = `+91${calldata.formdata.incomingNumber}`
  const textToShare = "hii"

  // Open WhatsApp Web with the message
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    textToShare
  )}`

  // Open WhatsApp Web
  window.open(whatsappUrl, "_blank")
}
