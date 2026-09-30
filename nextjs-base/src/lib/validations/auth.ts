import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 6;

type Translate = (
  key: 'emailRequired' | 'emailInvalid' | 'passwordMin',
  values?: { min: number },
) => string;

/** Schema factory so validation messages can be translated with next-intl. */
export const createLoginSchema = (t: Translate) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('emailRequired'))
      .pipe(z.email(t('emailInvalid'))),
    password: z.string().min(PASSWORD_MIN_LENGTH, t('passwordMin', { min: PASSWORD_MIN_LENGTH })),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
