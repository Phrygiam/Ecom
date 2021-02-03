import React, {useState} from "react"
import {Form, Button} from "react-bootstrap"

const Searchbar = ({history}) => {

    const [keyword, setKeyword] = useState("")

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword.trim()) {
            history.push(`/search/${keyword}`)
        } else {
            history.push("/")
        }
    }
    return (
        <Form inline onSubmit={submitHandler}>
            <Form.Control 
                        type="text" 
                        name="query" 
                        placeholder="Search product..." 
                        onChange={ (e) => setKeyword(e.target.value)}>
            </Form.Control>

            <Button type="submit" className = "ml-1 my-3 btn-dark confirm rounded" size="sm">Search</Button>
        </Form>
    )
}

export default Searchbar
