import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
export default function List() {

    const [products, setProducts] = useState([])
 const navigate = useNavigate();
    useEffect(()=>{
        fetchProducts() 
    })

    const fetchProducts = async () => {
        await axios.get(`http://localhost:8000/api/productos/listProducts`).then(({data})=>{
            setProducts(data)
        })
    }

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Seguro desea eliminar?',
            text: "Esta accion no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }
		   const formData = new FormData()

           formData.append('id', id)
 

          await axios.post(`http://localhost:8000/api/productos/deleteProduct`, formData).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
             navigate("/")
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }
 
    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/product/create"}>
                    Crear Producto
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
									<th>Precio</th>
									<th>Titulo</th>
                                    <th>Descripcion</th>
                                    <th>Imagen</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
									
                                    products.length > 0 && (
                                        products.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.nombre}</td>
                                                <td>{row.precio}</td>
                                                <td>{row.titulo}</td>
                                                <td>{row.descripcion}</td>
                                                <td>
                                                    <img width="150px" alt='' src={`http://localhost:8000/products/image/${row?.imagen}`} />
                                                </td>
                                                <td>
                                                    <Link to={`/product/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Edit
                                                    </Link>
                                                    <Button variant="danger" onClick={()=>deleteProduct(row.id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}