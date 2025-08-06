export const AnalyticsDialogLayout = (props: {
  isOpen: boolean
  message: React.ReactNode
  actions: React.ReactNode
}) => {
  return (
    <>
      {props.isOpen && (
        <div className="fixed bottom-14 right-0 z-50 animate-in zoom-in duration-200 mx-3 sm:mx-6">
          <div className="bg-white border rounded-lg shadow-lg p-8 max-w-md">
            <div className="text-center mb-3">
              <div className="text-sm pb-3 leading-tight">{props.message}</div>
            </div>
            <div className="flex justify-center gap-2">{props.actions}</div>
          </div>
        </div>
      )}
    </>
  )
}
