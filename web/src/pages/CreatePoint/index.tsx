import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';
import logo from '../../assets/img/logo.svg';
import api from '../../services/api';

interface Item {
    id: number;
    title: string;
    image_url:string
}

interface UF {
    sigla: string;
    nome: string;
}

interface IBGECity {
    id: number;
    nome: string;
}

interface IBGECityResponse {
    id: number;
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<UF[]>([]);
    const [citties, setCities] = useState<IBGECity[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();
    

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:'',
        address:'',
        number:''
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position=>{
           const { latitude, longitude } =  position.coords;
           setInitialPosition([latitude, longitude])
       })
    },[])

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data)
        })
    },[])

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
            setUfs(res.data)
        })
    },[])

    useEffect(() => {
        if(selectedUf==='0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`).then(res => {
            const cityNames = res.data.map(city=>{
                return {
                    id:city.id,
                    nome: city.nome
                }
            })
            setCities(cityNames)
        })
    })

    function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>){
        const uf = e.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>){
        const city = e.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(e: LeafletMouseEvent) {
        setSelectedPosition([
            e.latlng.lat, e.latlng.lng
        ])
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target;
        setFormData({...formData, [name]:value})
    }

    function handleSelectedItems(id: number) {
        const ExistingItem = selectedItems.findIndex(item => item === id);
        if (ExistingItem >= 0) {
            const FilteredItems = selectedItems.filter(item => item !==id)
            setSelectedItems(FilteredItems)
        } else {
            setSelectedItems([...selectedItems,id])
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const {name,email,whatsapp, address, number} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude,longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,email,whatsapp, address, number, uf, city, latitude, longitude, items
        }
        await api.post('points',data).then(res => {
            alert("Ponto cadastrado com sucesso!");
            history.push('/');
        })
    }

    return (
        <div id="page-create-point">
            <header> 
            <img src={logo} alt="Ecoleta"></img> 
            <Link to="/"><FiChevronLeft/>
            Voltar para a Home</Link>
            </header>
            <form onSubmit={handleSubmit}>
                    <h1>Cadastro do ponto <br/> de coleta</h1>
                    <fieldset>
                        <legend><h2>Dados</h2></legend>
                        <div className="field">
                            <label htmlFor="name">Nome do ponto de coleta:</label>
                            <input type="text" name="name" id="name" onChange={handleInputChange} />
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail:</label>
                                <input type="email" name="email" id="email" onChange={handleInputChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp:</label>
                                <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                            </div>
                        </div>
                       
                    </fieldset>
                    <fieldset>
                        <legend><h2>Endereco</h2><span>Selecione o endereço no mapa</span></legend>
                        <Map center={initialPosition} zoom={13} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                             <Marker position={selectedPosition[0]?selectedPosition:initialPosition}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                            </Marker>
                        </Map>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="address">Logradouro:</label>
                                <input type="text" name="address" id="address" onChange={handleInputChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="number">Numero:</label>
                                <input type="text" name="number" id="number" onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label  htmlFor="uf">Estado:</label>
                                <select onChange={handleSelectedUf} name="uf" id="uf">
                                <option key="0">Selecione o estado</option>
                                    {ufs.map(uf => (
                                        <option key={uf.sigla} value={uf.sigla} >{uf.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">City:</label>
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity} >
                                    <option key="0">Selecione a cidade</option>
                                    {citties.map(city => (
                                        <option key={city.id} value={city.nome} >{city.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend><h2>Itens de coleta</h2></legend>
                        <ul className="items-grid">
                            {items.map(item => (
                                <li onClick={()=>handleSelectedItems(item.id)} key={item.id} 
                                className={selectedItems.includes(item.id)? 'selected': ''}>
                                <img src={`${item.image_url}`} alt="{item.title}"/><span>{item.title}</span>
                                </li>
                            ))}
                           
                        </ul>
                    </fieldset>
                    <button type="submit">Cadastrar</button>
                </form>
        </div>
    )
}

export default CreatePoint;