import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useReactHookForm } from 'react-hook-form'

export function useForm({ schema, defaultValues }) {
  return useReactHookForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  })
}
