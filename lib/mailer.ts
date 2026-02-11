import { Env } from '@/shared/constants/environments'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { CreateEmailResponse, Resend } from 'resend'

export const resend = new Resend(Env.RESEND_API_KEY)

const TEMPLATES_DIR = path.join(process.cwd(), 'shared', 'templates')

function replaceHtmlKeys(html: string, vars: Record<string, string>): string {
  let result = html
  for (const key of Object.keys(vars)) {
    const placeholder = `{{${key}}}`
    const value = String(vars[key] ?? '')
    result = result.split(placeholder).join(value)
  }
  return result
}

export async function sendOrderEmail(
  to: string,
  subject: string,
  templateName: string,
  vars: Record<string, string> = {},
): Promise<CreateEmailResponse> {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`)
  const template = await readFile(templatePath, 'utf8')
  const processedHtml = replaceHtmlKeys(template, vars)

  return await resend.emails.send({
    from: Env.RESEND_FROM_EMAIL_ORDERS,
    to,
    subject,
    html: processedHtml,
    attachments: [
      {
        path: 'https://kltckzffzhprvaaytscz.supabase.co/storage/v1/object/public/assets/general/logo.webp',
        filename: 'logo.webp',
        contentId: 'logo',
      },
    ],
  })
}
