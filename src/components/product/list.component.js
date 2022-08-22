import React, { useEffect, useState,useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

import Pagination from '../pagination/Pagination';
import './style.scss';
let PageSize = 10;
export default function List() {

    const [products, setProducts] = useState([])
	 
	   const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0)
 const navigate = useNavigate();
 
     useEffect(()=>{
        fetchProducts() 
    },[]) 
 
     const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return products.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

    const fetchProducts = async () => {
			try{
				await axios.get(`https://backend.karenaguirre.online/api/productos/listProducts`).then(({data})=>{
					setProducts(data)
					 setCurrentPage(1);
				}).catch(err => {
				   console.log(err);
				   });
			} catch (error) {
				setError(error.message);
			  } finally {
				setLoaded(true);
			  }
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
 

          await axios.post(`https://backend.karenaguirre.online/api/productos/deleteProduct`, formData).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            }).then(function() {
 
	 fetchProducts();
});
           
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
                                    <th>Descripcion</th>
                                    <th>Precio</th>
                                    <th>Imagen</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
							
                                {
									
                                    currentTableData.length > 0 && (
                                        currentTableData.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.titulo}</td>
                                                <td>{row.descripcion}</td>
                                                <td>{row.precio}</td>
                                                <td>
                                                    <img width="150px" alt='' src={`https://backend.karenaguirre.online/product/image/${row?.imagen}`} />
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
						<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={products.length}
								pageSize={PageSize}
								onPageChange={page => setCurrentPage(page)}
								/>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}