const FileTreeNode = ({ onSelect, path, fileName, nodes }) => {
    const isDir = !nodes;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isDir) return;
          onSelect(path);
        }}
        style={{ marginLeft: "10px" }}
      >
        <p className={isDir ? "" : "file-node"}>{fileName}</p>
        {nodes && fileName !== "node_modules" && (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child} className='cursor-pointer' onClick={console.log('hello')}>
                <FileTreeNode
                  onSelect={onSelect}
                  path={path + "/" + child}
                  fileName={child}
                  nodes={nodes[child]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  const FileTree = ({ tree, onSelect }) => {
    return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
  };
  export default FileTree;