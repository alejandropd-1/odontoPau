import { NextResponse } from 'next/server';

const EDITORIAL_PASSWORD = process.env.EDITORIAL_PASSWORD || 'PaulaSalud2026!';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === EDITORIAL_PASSWORD) {
      const response = NextResponse.json({ success: true });

      // Set secure HttpOnly cookie for session authentication
      response.cookies.set({
        name: 'editorial_session',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Contraseña incorrecta. Intentá nuevamente.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la solicitud de inicio de sesión.' },
      { status: 400 }
    );
  }
}
