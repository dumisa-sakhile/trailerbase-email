import express from "express";
import sanitizeHtml from "sanitize-html";

const createEmailRouter = (resend) => {
  const router = express.Router();

  // Welcome email endpoint
  router.post("/api/send-email", async (req, res) => {
    try {
      const { to, userName, from = "welcome@api.trailerbase.tech" } = req.body;

      // Input validation
      if (!to || !userName) {
        return res
          .status(400)
          .json({ error: "Missing required fields: to and userName" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate from address
      if (from !== "welcome@api.trailerbase.tech") {
        return res.status(400).json({ error: "Invalid from address" });
      }

      if (!resend) {
        throw new Error("Resend client not initialized");
      }

      // Send email using Resend
      const data = await resend.emails.send({
        from,
        to,
        subject: "Welcome to Trailerbase!",
          html: `
        <!doctype html>
<html>
  <body>
    <div
      style='background-color:#ffffff;color:#FFFFFF;font-family:"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#ffffff"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:24px 24px 24px 24px;text-align:center">
                <img
                  alt=""
                  src="https://www.trailerbase.tech/favicon.ico"
                  style="outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
              <div
                style='color:#000000;font-size:16px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;text-align:center;padding:16px 24px 16px 24px'
              >
                Welcome to TrailerBase
              </div>
              <h3
                style='color:#000000;font-weight:bold;text-align:center;margin:0;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:20px;padding:16px 24px 16px 24px; text-decoration: none;'
              >
                ${to}
              </h3>
              <div
                style='color:#868686;font-size:16px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;text-align:center;padding:16px 24px 16px 24px'
              >
                Trailer Base is a movie and TV trailer platform that provides
                users with the latest trailers and information about their
                favorite movies and TV shows. Now that you have created an
                account, when you login, you will have an ability to bookmark
                any movie or series you like. Enjoy and start bookmarking!
              </div>
              <div
                style='color:#868686;font-size:14px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;text-align:center;padding:16px 24px 16px 24px'
              >
                This is an automated email, please do not respond to it
              </div>
              <div
                style='color:#737373;font-size:12px;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-weight:normal;text-align:center;padding:16px 24px 16px 24px'
              >
                Support? Email support@trailerbase.tech
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`,
        text: `Welcome to TrailerBase ${userName}! We're pleased to have you on board. 

If you need any help, visit our website or contact support.

Thank you,
The TrailerBase Team`,
      });

      res.status(200).json({ message: "Email sent successfully", data });
    } catch (error) {
      console.error("Error sending email:", error.message);
      res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Something went wrong!" });
    }
  });

  return router;
};

export default createEmailRouter;
