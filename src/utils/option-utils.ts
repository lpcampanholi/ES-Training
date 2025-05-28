export function getValueColor(value: number): string {
  switch (value) {
    case 0:
      return "bg-red-100 text-red-800"
    case 4:
      return "bg-yellow-100 text-yellow-800"
    case 7:
      return "bg-blue-100 text-blue-800"
    case 10:
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getValueText(value: number): string {
  switch (value) {
    case 0:
      return "Totalmente errada"
    case 4:
      return "Parcialmente certa"
    case 7:
      return "Quase certa"
    case 10:
      return "Totalmente certa"
    default:
      return value.toString()
  }
}
