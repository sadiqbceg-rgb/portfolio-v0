'use client';

import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { contact, identity } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/* Contact — a Haze Card holding Text Inputs (4px radius, the only place that
 * radius is used) and a Solid Light Button.
 *
 * With `contact.formEndpoint` empty the form renders disabled behind an honest
 * note rather than pretending to send. Set the endpoint in src/content/site.ts
 * and it goes live — no other change needed.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const live = Boolean(contact.formEndpoint);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!live) return;

    const form = event.currentTarget;
    setStatus('sending');

    try {
      const response = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="py-section">
      <div className="shell flex flex-col gap-section">
        <SectionHeader
          eyebrow={contact.eyebrow}
          title={contact.title}
          subtitle={contact.subtitle}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <div className="card-haze">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <fieldset disabled={!live} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-caption text-ink/70">Name</span>
                    <input
                      className="input"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Ada Lovelace"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-caption text-ink/70">Email</span>
                    <input
                      className="input"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="ada@example.com"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-caption text-ink/70">Message</span>
                  <textarea
                    className="input min-h-32 resize-y"
                    name="message"
                    required
                    rows={5}
                    placeholder="What are you working on?"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn-haze">
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </button>

                  <p aria-live="polite" className="text-caption text-ink/70">
                    {status === 'sent'
                      ? 'Thanks — I will get back to you.'
                      : status === 'error'
                        ? 'Something went wrong. Email me instead.'
                        : ''}
                  </p>
                </div>
              </fieldset>
            </form>

            {!live ? (
              <p className="text-caption mt-4 border-t border-ink/10 pt-4 text-ink/60">
                The form is inactive until you set{' '}
                <code className="text-ink">contact.formEndpoint</code> in{' '}
                <code className="text-ink">src/content/site.ts</code>. Until
                then, email is the way through.
              </p>
            ) : null}
          </div>

          <div className="flex h-fit flex-col gap-4 rounded-card border hairline p-card">
            <p className="text-caption text-whiteout/50">Direct</p>
            <a
              href={`mailto:${identity.email}`}
              className="link-underline self-start text-body"
            >
              {identity.email}
            </a>

            <p className="text-caption pt-4 text-whiteout/50">Elsewhere</p>
            <ul className="flex flex-col items-start gap-3">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-body"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
