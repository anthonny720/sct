import {useState} from 'react';

const ModalHook = () => {
    /*MODAL*/
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    let [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen((prev) => !prev)
    }

    return {title, setTitle, content, setContent, isOpen, setIsOpen, openModal}
};

export default ModalHook;
