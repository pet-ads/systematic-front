import axios from "../../interceptor/interceptor";


const useCreateProtocolTwo = async (keywords: string[], studiesLanguages: string[], 
    databases: string[], researchStrategy: string, selectionProcess: string, dataAcquisition: string, 
    inclusionCriteria: {"description": string, "type": "INCLUSION" | "EXCLUSION"}[], 
    exclusionCriteria: {"description": string, "type": "INCLUSION" | "EXCLUSION"}[], 
    researchQuestions: string[], analysis: string, id: string) => {

    const eligibilityCriteria = [];

    for(let i = 0; i < inclusionCriteria.length; i++){
        eligibilityCriteria.push(inclusionCriteria[i]);
    }

    for(let i = 0; i < exclusionCriteria.length; i++){
        eligibilityCriteria.push(exclusionCriteria[i]);
    }

    const data = {
        keywords,
        informationSources: databases,
        studiesLanguages,
        searchMethod: researchStrategy,
        selectionProcess: selectionProcess,
        sourcesSelectionCriteria: dataAcquisition,
        eligibilityCriteria,
        researchQuestions,
        analysisAndSynthesisProcess: analysis
    }

    const url = `http://localhost:8080/systematic-study/${id}/protocol`

    try{
        let response = await axios.put(url, data, {withCredentials: true});
        console.log(response);
    }
    catch(err){
        console.log(err);
    }
}

export default useCreateProtocolTwo