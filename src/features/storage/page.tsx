import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useStorage, useUploadFile, useDeleteFile, useRenameFile } from "./use-storage"
import { useSupabaseStorage, useSupabaseUploadFile, useSupabaseDeleteFile } from "./use-supabase-storage"
import { StorageView } from "./storage-view"

function FirebaseStoragePanel() {
  const [path, setPath] = useState("")
  const { data: items, isLoading, error } = useStorage(path)
  const uploadFile = useUploadFile(path)
  const deleteFile = useDeleteFile(path)
  const renameFile = useRenameFile(path)

  return (
    <StorageView
      providerName="Firebase"
      items={items}
      isLoading={isLoading}
      error={error as Error | null}
      path={path}
      onPathChange={setPath}
      onUpload={async (file) => {
        await uploadFile.mutateAsync({ file })
      }}
      onDelete={async (name) => {
        await deleteFile.mutateAsync(name)
      }}
      onRename={async (oldName, newName) => {
        await renameFile.mutateAsync({ oldName, newName })
      }}
      onCreateFolder={async (name) => {
        const dummyFile = new File([], ".keep", { type: "text/plain" })
        // For Firebase, we use the hook with 'path' as the base, so we just append the new folder name and .keep
        // Actually, useUploadFile(path) sets the base. 
        // So we just need to pass the relative path "folderName/.keep"
        await uploadFile.mutateAsync({ file: dummyFile, path: `${name}/.keep` })
      }}
    />
  )
}

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
      <Tabs defaultValue="firebase" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="firebase">Firebase Storage</TabsTrigger>
            <TabsTrigger value="supabase">Supabase Storage</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="firebase" className="mt-0">
          <FirebaseStoragePanel />
        </TabsContent>
        
        <TabsContent value="supabase" className="mt-0">
          <SupabaseStoragePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
