import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../interceptor/interceptor";
import FlexLayout from "../../components/ui/Flex/Flex";
import Header from "../../components/ui/Header/Header";
import {
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Box,
} from "@chakra-ui/react";

export default function IdentificationSession() {
    const { session = "" } = useParams();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        console.log(session);
        // async function fetchValues(){
        //   let accessToken = localStorage.getItem('accessToken');
        //   let options = {
        //     headers: { Authorization: `Bearer ${accessToken}` }
        //   }

        //   //mudar para url da tabela dos artigos (session)
        //   const url = `http://localhost:8080/systematic-study/identification/${session}`;
        //   let response = await axios.get(url, options);

        //   if(response.data.content){
        //     setArticles(response.data.content);        
        //   }
        // }
        // fetchValues();
    }, []);

    function returnIdentification() {
        window.history.back();
    }

    return (
        <FlexLayout defaultOpen={1} navigationType="Accordion">
            <Header text="Search Sessions" />

            <Flex justifyContent={"center"}>
                <TableContainer maxWidth={"80%"} mt={5}  borderRadius="15px 15px 0 0" >
                    <Table
                        variant="simple"
                        colorScheme="#263C56"
                        size="md"
                        boxShadow="md"
                    >
                        <Thead bg="#263C56" borderRadius={10}>
                            <Tr>
                                <Th color="white">ID Paper</Th>
                                <Th color="white">Title</Th>
                                <Th color="white">Author</Th>
                                <Th color="white">Year</Th>
                                <Th color="white">Status/Selection</Th>
                                <Th color="white">Status/Extraction</Th>
                                <Th color="white">Reading Priority</Th>
                                <Th color="white">Score</Th>
                            </Tr>
                            
                        </Thead>
                        <Tbody>


                            <Tr
                                _hover={{ bg: "#EBF0F3" }}
                                transition="background-color 0.3s"
                            >

                                <Td>1</Td>
                                <Td>title</Td>
                                <Td>author</Td>
                                <Td>year</Td>
                                <Td>status/selection</Td>
                                <Td>status/extraction</Td>
                                <Td>reading priority</Td>
                                <Td>score</Td>
                            </Tr>
                            <Tr
                                _hover={{ bg: "#EBF0F3" }}
                                transition="background-color 0.3s"
                            >

                                <Td>2</Td>
                                <Td>title</Td>
                                <Td>author</Td>
                                <Td>year</Td>
                                <Td>status/selection</Td>
                                <Td>status/extraction</Td>
                                <Td>reading priority</Td>
                                <Td>score</Td>
                            </Tr>
                            <Tr
                                _hover={{ bg: "#EBF0F3" }}
                                transition="background-color 0.3s"
                            >

                                <Td>3</Td>
                                <Td>title</Td>
                                <Td>author</Td>
                                <Td>year</Td>
                                <Td>status/selection</Td>
                                <Td>status/extraction</Td>
                                <Td>reading priority</Td>
                                <Td>score</Td>
                            </Tr>


                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </FlexLayout>
    );
}