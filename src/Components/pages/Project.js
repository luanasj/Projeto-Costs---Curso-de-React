import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'

import Loading from "../layout/Loading"
import ProjectForm from "../project/ProjectForm"
import ServiceForm from "../Service/ServiceForm"
import Container from '../layout/Container'
import Message from '../layout/Message'


import {useParams} from 'react-router-dom'
import {useState , useEffect} from 'react'
import ServiceCard from '../Service/ServiceCard'

function Project() {
    const {id} = useParams()

    const [project,setProject] = useState([])
    const [services, setServices] = useState()
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message,setMessage] = useState()
    const [type,setType] = useState()



    useEffect(()=>{
        fetch(`http://localhost:5000/projects/${id}`,{
            method: "GET",
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then((res)=>res.json())
        .then((dados)=>{
            //console.log(dados)
            setProject(dados)
            setServices(dados.services)
            //console.log(project.name)
        })
        .catch((err)=>{console.log(err)})

        

    },[id])

    function editPost(project){
        setMessage('')
        //budget validation

        if(project.budget < project.cost){
            setMessage('Orçamento não pode ser menor que o custo de projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: "PATCH",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(project)
        })
        .then(res=>res.json())
        .then((dados)=>{
            setProject(dados)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado!')
            setType('success')
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function createService(project){
        setMessage('')
        //last service
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()
        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        
        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        //add service cost to project total cost
        project.cost = newCost

        //update project
        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'aplication/json'
            },
            body: JSON.stringify(project)
        })
        .then(res=>res.json())
        .then((dados)=>{
            setShowServiceForm(false)
     
        })
        .catch((err)=>console.log(err))


    }

    function removeService(id,cost){
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated

        projectUpdated.cost = parseFloat(projectUpdated.cost - parseFloat(cost))

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(res=>res.json())
        .then(()=>{
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')

        })

    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }
    

    return (
    <>
        {project.name ? 
           ( <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message}/>}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p><span>Categoria:</span> {project.category.name}</p>
                                <p><span>Total de Orçamento:</span> {project.budget}</p>
                                <p><span>Total Utilizado:</span> {project.cost}</p>

                            </div>
                        ) : (
                            <div className={styles.project_info}>
                                <ProjectForm handleSubmit={editPost} btnText='Concluir Edição' projectData={project}/>
                            </div>
                        )}

                    </div>
                    <div className={styles.service_form_container}>
                        <h1>Adicione um Serviço</h1>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (
                                <ServiceForm
                                    handleSubmit={createService}
                                    btnText='AdicionarServiço'
                                    projectData={project}

                                />
                            )}
                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass='start'>
                        {services.length > 0 &&
                            services.map((service)=>(
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                />

                            ))
                        }
                        {services.length === 0 && <p>Não há serviços cadastrados</p>}
                    </Container>
                </Container>
            </div>)
         : (
            <Loading/>
         )}
    </>
        
    )
}

export default Project