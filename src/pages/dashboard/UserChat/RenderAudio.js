import React from 'react'
import { FileTypeId, findFileType } from '../../../helpers/chatConstants';

export default function RenderAudio({ chatFile, url }) {
    return (
        <>
            {chatFile &&  FileTypeId.Audio?.includes(findFileType(chatFile?.type)) && (
                <div className="text-center">
                    <audio controls>
                        <source src={URL.createObjectURL(chatFile)} type="audio/mp3" />
                    </audio>
                </div>
            )}
            {
                url &&
                <div className="text-center">
                    <audio controls>
                        <source src={url} type="audio/mp3" />
                    </audio>
                </div>
            }

        </>
    )
}
