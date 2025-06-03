// app/api/send-email/route.ts (Next.js 13+ s app directory)
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail", // ili npr. "hotmail", "zoho", itd.
      auth: {
        user: 'drasko.kosovic@gmail.com',
        pass: 'civc scwo svdb leup',
      },
    });

    const mailOptions = {
      from: 'drasko.kosovic@gmail.com',
      to: 'drasko.kosovic@gmail.com',
      subject: `Poruka sa sajta od ${name}`,
      text: message,
      html: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
