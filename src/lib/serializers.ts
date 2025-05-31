import { Question as QuestionEntity } from "@/types/entities"
import { Subject, Level } from "@/types/enums"
import { Question as PrismaQuestion, Option } from "@prisma/client"

export function serializeQuestion(q: PrismaQuestion & { options: Option[] }): QuestionEntity {
  return {
    id: q.id,
    text: q.text,
    subject: q.subject as Subject,
    level: q.level as Level,
    options: q.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      value: opt.value,
    })),
  }
}