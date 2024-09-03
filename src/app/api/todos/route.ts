import { NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { text } = await request.json();
  const newTodo = await prisma.todo.create({
    data: { text },
  });
  return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json();
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(updatedTodo);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ id });
}
