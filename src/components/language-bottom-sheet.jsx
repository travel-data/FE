import { Drawer } from 'vaul'

export function LanguageBottomSheet({ open, onClose }) {
  return (
    <Drawer.Root open={open} dismissible={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-[#000]/20" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[408px] w-full max-w-[430px] flex-col rounded-t-[50px] bg-bg-main px-6 pb-6 pt-16">
          <Drawer.Title className="text-title3 text-text-heading">
            오이소를 한국어로 사용하시겠습니까?
          </Drawer.Title>
          <Drawer.Description className="text-label text-text-subdued">
            언어 설정은 홈에서 바꿀 수 있습니다
          </Drawer.Description>
          <div className="mt-auto flex flex-col gap-2.5 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="h-14 w-full rounded-[12px] border border-brand-primary bg-primary-50 p-3 text-left text-body1 text-text-default"
            >
              예
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-14 w-full rounded-[12px] border border-border-1 p-3 text-left text-body1 text-text-default"
            >
              영어로 변경
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
