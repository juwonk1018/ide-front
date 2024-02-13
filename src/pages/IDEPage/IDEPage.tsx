import React from "react"

/* Component */
import FileTree from "@/components/filetree/FileTree"
import Editor from "@/components/editor/Editor"
import ChatButton from "@/components/button/ChatButton"

/* UI */
import { ActiveFileProvider, useActiveFile } from "../../context/ActiveFileContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"

/* State */
import { FileStructureProvider } from "context/FileStructureContext"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { toggleTreeVisible } from "./FileTreeSlice"

const IDEPage = () => {
  return (
    <ActiveFileProvider>
      <FileStructureProvider>
        <IDEContent />
      </FileStructureProvider>
    </ActiveFileProvider>
  )
}

const IDEContent = () => {
  const isFileTreeVisible = useSelector((state: RootState) => state.fileTree.value)
  const dispatch = useDispatch()
  const { tabs, setTabs, activeFile, setActiveFile, activeFileContent, setActiveFileContent } = useActiveFile()

  const toggleFileTree = () => {
    dispatch(toggleTreeVisible())
  }
  // addTab 함수는 이제 파일의 'data'와 'content'를 받습니다.
  const addTab = (fileData: string, fileContent: string) => {
    const isTabOpen = tabs.some(tab => tab.data === fileData)
    if (!isTabOpen) {
      setTabs(prevTabs => [...prevTabs, { data: fileData, content: fileContent }])
    }
    setActiveFile(fileData) // 파일의 'data'를 활성 파일로 설정합니다.
    setActiveFileContent(fileContent)
  }

  const removeTab = (fileData: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.data !== fileData))
    if (activeFile === fileData) {
      setActiveFile("")
      setActiveFileContent("")
    }
  }

  const isTabActive = (fileData: string) => activeFile === fileData
  return (
    <div className="flex h-screen bg-slate-600">
      <div className={`transition-width duration-500 ${isFileTreeVisible ? "w-64" : "w-0"} overflow-auto`}>
        <FileTree />
      </div>

      <button
        onClick={toggleFileTree}
        className="mt-5 ml-[-1.25rem] z-20 p-2 bg-gray-700 text-white  hover:bg-blue-700 transition-transform duration-500"
        style={{ transform: `translateX(${isFileTreeVisible ? "100%" : "0"})` }}
      >
        {isFileTreeVisible ? "«" : "»"}
      </button>

      <ChatButton />

      <div className="flex-1 overflow-y-auto pl-5 mt-5">
        <div className="flex ml-1">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`p-2 border ${isTabActive(tab.data) ? "bg-lime-500 text-white" : "bg-gray-700 text-white"}`}
              onClick={() => {
                setActiveFile(tab.data)
                console.log(tab.data)
                setActiveFileContent(tab.content)
              }}
            >
              {tab.data}
              <button onClick={() => removeTab(tab.data)} className="ml-3">
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <Editor />
        </div>
      </div>
    </div>
  )
}

export default IDEPage