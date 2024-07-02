import {useState} from 'react'

import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import styles from '../project/ProjectForm.module.css'

function Form({handleSubmit, btnText, projectData}){

    const [service,setService] = useState({})

    function submit(evt){
        evt.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
    }

    function handleChange(evt){
        setService({...service, [evt.target.name]: evt.target.value})
    }

    return(

    <form onSubmit={submit}>
        <Input
        type="text"
        text='Nome do Serviço'
        name="name"
        placeholder="Insira o nome do serviço"
        handleOnChange={handleChange}
        />
        <Input
        type="number"
        text='Custo do Serviço'
        name="cost"
        placeholder="Insira o valor total"
        handleOnChange={handleChange}
        />
        <Input
        type="text"
        text='Descrição do Serviço do Serviço'
        name="description"
        placeholder="Descreva o Serviço"
        handleOnChange={handleChange}
        />
        <SubmitButton text={btnText}/>
    </form>
    )
}

export default Form