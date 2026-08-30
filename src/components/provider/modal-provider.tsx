import PlaceDetailSheet from '@/components/place/place-detail-sheet'
import ConfirmModal from '@/components/modal/confirm-modal'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'

function ModalProvider() {
  const placeSheet = usePlaceDetailSheetStore()
  const confirm = useConfirmModalStore()

  return (
    <>
      <PlaceDetailSheet
        isOpen={placeSheet.isOpen}
        onClose={placeSheet.close}
        placeId={placeSheet.placeId!}
        placeCategory={placeSheet.placeCategory!}
        actionButton={placeSheet.actionButton}
      />
      <ConfirmModal
        open={confirm.isOpen}
        onOpenChange={(open) => !open && confirm.close()}
        title={confirm.title}
        description={confirm.description}
        cancelLabel={confirm.cancelLabel}
        actionLabel={confirm.actionLabel}
        onCancel={confirm.onCancel}
        onAction={confirm.onAction}
      />
    </>
  )
}

export default ModalProvider
