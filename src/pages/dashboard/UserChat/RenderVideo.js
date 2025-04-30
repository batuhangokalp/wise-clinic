import React, { useEffect } from 'react'
import { FileTypeId, findFileType } from '../../../helpers/chatConstants';

export default function RenderVideo({ chatFile, url }) {
  
    useEffect(() => {
        if (url) {
            console.log(url);
        }
    }, [url])
        return(
        <>
            {chatFile && findFileType(chatFile?.type) === FileTypeId.Video && (
                <div className="text-center"  style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }}>
                    <video controls width="100%">
                        <source src={URL.createObjectURL(chatFile)} type="video/mp4"  style={{ maxWidth: "400px", maxHeight:"400px", justifyContent:"center"}}/>
                    </video>
                </div>
            )}
            {
                url &&
                <div className="text-center"  style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }}>
                    <video controls width="100%"  style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }}>
                        <source src={url} type="video/mp4"  style={{ width: "100%", height: "100%", maxWidth:"400px", maxHeight:"400px", justifyContent:"center", alignContent:"center" }}/>
                    </video>
                </div>
            }
        </>
    )
}
