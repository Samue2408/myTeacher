import emailService from "@/api/email.service";
import { UsersService } from "@/api/user.service";
import type { BookingsType } from "@/types/bookings";

interface UserIdentity {
  _id?: string;
  name?: string;
}

function isEmailRecipient(value: unknown): value is { email: string; name?: string } {
  if (typeof value !== "object" || value === null || !("email" in value)) return false;

  const email = value.email;
  return typeof email === "string" && email.trim().length > 0;
}

export async function sendMeetingJoinNotification(
  booking: BookingsType,
  joiningUser: UserIdentity,
): Promise<void> {
  const joiningUserId = joiningUser._id;
  if (!joiningUserId) throw new Error("No se pudo identificar a quien se unió a la reunión.");

  let recipientId: string;
  if (booking.student._id === joiningUserId) {
    recipientId = booking.tutor?._id || booking.tutorId;
  } else if (booking.tutorId === joiningUserId || booking.tutor?._id === joiningUserId) {
    recipientId = booking.student._id;
  } else {
    throw new Error("El usuario actual no pertenece a esta reserva.");
  }

  if (!recipientId || recipientId === joiningUserId) {
    throw new Error("No se pudo identificar al otro participante de la reserva.");
  }

  const recipient: unknown = await UsersService.getById(recipientId);
  if (!isEmailRecipient(recipient)) {
    throw new Error("No se encontró un correo válido para el otro participante.");
  }

  const joiningName = joiningUser.name?.trim() || "Tu estudiante o tutor";
  const recipientName =
    "name" in recipient && typeof recipient.name === "string" ? recipient.name.trim() : "";

  await emailService.sendCustom({
    to: recipient.email,
    subject: "Tu participante se unió a la clase virtual",
    previewText: `${joiningName} abrió el enlace de la videollamada.`,
    title: "Tu clase virtual está comenzando",
    message: `${recipientName ? `Hola ${recipientName}, ` : ""}${joiningName} pulsó el enlace para unirse a la videollamada.`,
    buttonText: "Ir a la videollamada",
    buttonLink: booking.videoCallLink || "",
  });
}
