import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedTemplate } from '../../../redux/template/actions'

export default function TemplateEditor(props) {
    const { template } = props
    const dispatch = useDispatch()
    const [inputValues, setInputValues] = React.useState({})

    /*
    make a list of the tempalte property:
    templates includes "Merhaba! Ben {{1}}" parts and we need to replace them with the actual values.
    */
    const templateParts = template?.data?.split(/{{[0-9]+}}/g)
    const templateProperties = template?.data?.match(/{{[0-9]+}}/g)

    const handleTemplate = (e) => {
        e.preventDefault()
        
        // get the input id
        const id = e.target.id
        // get the input value
        const value = e.target.value
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value
        }))
    }

    useEffect(() => {
        const inputValuesArray = Object.values(inputValues)
        dispatch(setSelectedTemplate({ ...template, params: inputValuesArray }))
    }, [inputValues, template, dispatch])

    
  return (
   
      <div>
            {templateParts?.map((part, index) => {
                return (
                    <span key={index}>
                        {part}
                        {templateProperties?.[index] && <input id={templateProperties?.[index]} type="text" onChange={(e)=>handleTemplate(e)}/>}
                    </span>
                )
            })}
        </div>
  )
}
