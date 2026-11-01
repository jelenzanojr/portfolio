export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export function buildContactMailto({ name, email, message }: ContactMessage): string {
  const subject = encodeURIComponent(`Portfolio contact: ${name.trim()}`);
  const body = encodeURIComponent(
    `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
  );
  return `mailto:jelenzanjr@gmail.com?subject=${subject}&body=${body}`;
}
