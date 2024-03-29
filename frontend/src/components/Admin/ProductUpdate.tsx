import  { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
  } from '@chakra-ui/react'

import { ProdData, useAppDispatch } from '../../redux/utils/adminUtils';
import { updateDataProduct } from '../../redux/actions/actionAdmin';

interface ProductUpdateProps{
  isOpen: boolean;
  onClose:()=> void;
   productDetails:ProdData|{}
}
export function ProductUpdate({isOpen,onClose,productDetails}:ProductUpdateProps) {

    const [updateProduct,setUpdateProduct] = useState<ProdData>(productDetails);
    const dispatch = useAppDispatch();
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
     
       const {name,value} = e.target;
      if(name === "rate" || name === "count"){
        setUpdateProduct(prev=>({
          ...prev,rating:{
            ...prev.rating,[name]:value
          }
        }))
      }else{
        setUpdateProduct(prev=>({
          ...prev,[name]:value
        }))
      }
    }
    const handleUpdateData = () => {

      dispatch(updateDataProduct(updateProduct,updateProduct.id));
      onClose();
      
    }
    
      return (
        <>
  
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <Input
                type="text"
                name="title"
                value={updateProduct.title}
                onChange={handleInputChange}
                mb={2} 
              />
              <Input
                type="text"
                name="category"
                value={updateProduct.category}
                onChange={handleInputChange}
                mb={2} 
              />
              <Input
                type="number"
                name='price'
                value={updateProduct.price}
                onChange={handleInputChange}
                mb={2} 
              />
              <Input
                type="number"
                name='rate'
                value={updateProduct.rating?.rate}
                onChange={handleInputChange}
                mb={2} 
              />
              <Input
                type="number"
                name='count'
                value={updateProduct.rating?.count}
                onChange={handleInputChange}
                mb={2} 
              />
              <Textarea
               name='description'
                value={updateProduct.description}
                onChange={handleInputChange}
                mb={2} 
              />
               
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='ghost' onClick={handleUpdateData}>Update</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }
  
  