import { FileUpload } from 'primereact/fileupload';

export default function(){
    return(
        <div className="w-[80%] h-[90%] m-auto">
            <h1 className="text-4xl font-bold green-text mb-10">Config Page</h1>
            <FileUpload name="songs[]" url={'/api/upload'} multiple accept="audio/*" maxFileSize={10000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
        </div>
    )
}
