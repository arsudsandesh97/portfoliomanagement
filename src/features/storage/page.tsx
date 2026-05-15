import { useState } from "react"
import { useSupabaseStorage, useSupabaseUploadFile, useSupabaseDeleteFile } from "./use-supabase-storage"
import { StorageView } from "./storage-view"

function SupabaseStoragePanel() {
  const [path, setPath] = useState("")
  const { data: items, isLoading, error } = useSupabaseStorage(path)
  const uploadFile = useSupabaseUploadFile() // Uses default bucket
  const deleteFile = useSupabaseDeleteFile()

  return (
    <StorageView
      providerName="Supabase"
      items={items}
      isLoading={isLoading}
      error={error as Error | null}
      path={path}
      onPathChange={setPath}
      onUpload={async (file) => {
        const filePath = path ? `${path}/${file.name}` : file.name
        await uploadFile.mutateAsync({ file, path: filePath })
      }}
      onDelete={async (name) => {
        const filePath = path ? `${path}/${name}` : name
        await deleteFile.mutateAsync(filePath)
      }}
      onCreateFolder={async (name) => {
        const dummyFile = new File([], ".keep", { type: "text/plain" })
        const filePath = path ? `${path}/${name}/.keep` : `${name}/.keep`
        await uploadFile.mutateAsync({ file: dummyFile, path: filePath })
      }}
    />
  )
}

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <SupabaseStoragePanel />
    </div>
  )
}
