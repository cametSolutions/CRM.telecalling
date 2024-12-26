import nodemailer from "nodemailer"
import mongoose from "mongoose"
import Callnote from "../model/secondaryUser/callNotesSchema.js"
import Branch from "../model/primaryUser/branchSchema.js"
// Function to send email using Nodemailer
export const sendEmail = async (calldata, name, branchName, username) => {
 
  let organization
  let notificationemail
  let mailpassword
  const problem = new mongoose.Types.ObjectId(calldata.formdata.callnote)
  

  const customerproblem = await Callnote.find(problem)
 

  if (branchName === "ACCUANET") {
    organization = "Accuanet Info Solution"
    const result = await Branch.findOne({ branchName })
  
    notificationemail = result.notificationemail
    mailpassword = result.mailpassword
  } else if (branchName === "CAMET") {
    organization = "Camet IT Solution"
  }
 
  const isoDate = calldata.timedata.startTime
  const date = new Date(isoDate)

  // Date options: Get the date in 'dd-mm-yyyy' format
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })

  // Time options: Get the time in 'hh:mm:ss' format
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true // Use 24-hour format
  })

  // Combine formatted date and time
  const formattedDate = dateFormatter.format(date).replace(/\//g, "-")
  const formattedTime = timeFormatter.format(date)

  const finalDateTime = `${formattedDate} ${formattedTime}`

  // Create a transporter object with your SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: notificationemail, // Use environment variables for security
      pass: mailpassword // App-specific password
    },
    tls: {
      rejectUnauthorized: false // Bypass self-signed certificate validation
    }
  })

  // Construct the HTML table content
  const tableContent = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <thead>
           
          </thead>
          <tbody>
            <tr>
              <td>Date</td>
              <td>${finalDateTime || "N/A"}</td>
            </tr>
            <tr>
              <td>Token</td>
              <td>${calldata.timedata.token || "N/A"}</td>
            </tr>
               <tr>
              <td>Organization</td>
              <td>${organization || "N/A"}</td>
            </tr>
              <tr>
              <td>Contact No</td>
              <td>${calldata.formdata.incomingNumber || "N/A"}</td>
            </tr>
  
            <tr>
              <td>Product Name</td>
              <td>${calldata.productName || "N/A"}</td>
            </tr>
            <tr>
              <td>Serial No</td>
              <td>${calldata.license || "N/A"}</td>
            </tr>
            <tr>
              <td>Problem</td>
              <td>${customerproblem[0].callNotes || "N/A"}</td>
            </tr>
  
            <tr>
              <td>Call Status</td>
              <td>${calldata.formdata.status || "N/A"}</td>
            </tr>
            ${
              calldata.formdata.status === "solved"
                ? `
              <tr>
                <td>Remarks</td>
                <td>${calldata.formdata.solution || "N/A"}</td>
              </tr>`
                : ""
            }
          </tbody>
        </table>
      `

  // Email HTML content
  const htmlContent = `
        <p>Dear ${name},</p>
        <p>We would like to share the following details:</p>
        ${tableContent}

        <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:${notificationemail}">${notificationemail}</a>.</p>
        <p>Kind regards,<br>${username}<br>${organization}</p>
      `

  try {
    const info = await transporter.sendMail({
      from: notificationemail, // Sender's name and address
      to: calldata.customeremail, // Recipient's email address
      cc: "solutions@camet.in",
      subject: "Your Call Recorded", // Subject
      html: htmlContent // Email content as HTML
    })

    console.log(`Email sent successfully: ${info.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    return info // Return the response info after the email is sent
  } catch (error) {
    console.error("Error sending email: ", error.message)
    throw new Error("Failed to send email. Please check the configuration.")
  }
}
