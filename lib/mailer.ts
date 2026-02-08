import nodemailer from 'nodemailer'
import { Env } from '@/shared/constants/environments'

const { GMAIL_USER, GMAIL_PASSWORD } = Env
if (!GMAIL_USER || !GMAIL_PASSWORD) {
  throw new Error('GMAIL_USER and GMAIL_PASSWORD are required')
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
})

export function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: GMAIL_USER,
    to,
    subject,
    html,
  })
}
