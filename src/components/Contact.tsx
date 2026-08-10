'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eyebrow } from './Eyebrow';
import { TextReveal } from './TextReveal';
import { useScene, useSceneRange } from './ScrollScene';
import { contact, identity } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/* ============================================================================
 * CONTACT — the closing CTA.
 *
 * The reference ends on one oversized line, one button and a radial glow, with
 * everything else stripped away. That single-focus quality is most of the
 * emotional effect, so the header here is deliberately spare: a bracketed
 * eyebrow, the heading, and a glow that grows as the section arrives.
 *
 * The form is unchanged in behaviour. It stays disabled until
 * `contact.formEndpoint` is set, because a form that silently swallows
 * messages is worse than no form. That decision predates this redesign and
 * survives it.
 * ==========================================================================*/

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const reduced = useReducedMotion();
  const live = Boolean(contact.formEndpoint);

  const scene = useScene(['start end', 'center center']);
  const glowScale = useSceneRange(scene, [0, 1], [0.85, 1], 1);
  const glowOpacity = useSceneRange(scene, [0, 1], [0, 1], 1);

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
    <section
      id="contact"
      ref={scene.ref}
      className="relative overflow-hidden py-section-lg"
    >
      <motion.div
        aria-hidden="true"
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="glow-radial pointer-events-none absolute inset-0 -z-10"
      />

      <div className="shell flex flex-col gap-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <Eyebrow>Ready</Eyebrow>
          <TextReveal
            as="h2"
            className="font-control-tnt text-heading-lg text-whiteout max-w-[18ch] text-balance"
            lines={[contact.title]}
          />
          <p className="prose-longform text-body max-w-[56ch] text-whiteout/65">
            {contact.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:items-start">
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
                  <button type="submit" className="btn-haze group">
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
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
              <p className="text-caption mt-4 border-t border-ink/10 pt-4 text-ink/70">
                The form is inactive until you set{' '}
                <code className="text-ink">contact.formEndpoint</code> in{' '}
                <code className="text-ink">src/content/site.ts</code>. Until
                then, email is the way through.
              </p>
            ) : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{
              duration: reduced ? 0 : 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex h-fit flex-col gap-4 border-t hairline pt-6"
          >
            <Eyebrow bracketed={false}>Direct</Eyebrow>
            <a
              href={`mailto:${identity.email}`}
              className="link-underline self-start text-body"
            >
              {identity.email}
            </a>

            <Eyebrow bracketed={false} className="pt-4">
              Elsewhere
            </Eyebrow>
            <ul className="flex flex-col items-start gap-3">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline group text-body"
                  >
                    {social.label}
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
