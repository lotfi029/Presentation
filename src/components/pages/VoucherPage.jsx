import Card from '../shared/Card'
import VoucherForm from '../forms/VoucherForm'
import { useLanguage } from '../../hooks/useLanguage'

export default function VoucherPage() {
  const { t } = useLanguage()

  return (
    <Card title={t('voucherForm')} subtitle={t('voucherFormSub')}>
      <VoucherForm />
    </Card>
  )
}
