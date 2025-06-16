import useFetchAllStudies from "./fetch/useFetchAllStudies";
import useFetchProtocol from "./fetch/useFetchProtocol";
import {Protocol} from "../../public/interfaces/protocolInterface";
import {StudyReview} from "../../public/interfaces/studyReviewInterface";


function isProtocolPartOneFinished(response:  Protocol) {
    return response.goal !== null && response.justification !== null
}

function isPicocInitialized(response: Protocol){
  const { picoc } = response;
    return (picoc.control && response.picoc.control.trim() !== "") ||
           (picoc.intervention && response.picoc.intervention.trim() !== "") ||
           (picoc.outcome && response.picoc.outcome.trim() !== "") ||
           (picoc.population && response.picoc.population.trim() !== ""); 
}

function isPicocFinished(response: Protocol){
  const { picoc } = response;
  const { control, intervention, outcome, population } = picoc;
    return control !== null && intervention !== null
    && outcome !== null && population !== null; 
}
    
function isProtocolPartTwoFinished(response:  Protocol) {
     const { 
        studiesLanguages,
        eligibilityCriteria,
        informationSources,
        keywords,
        sourcesSelectionCriteria,
        searchMethod,
        selectionProcess } = response;

    return studiesLanguages !== null &&
        eligibilityCriteria !== null &&
        informationSources !== null &&
        keywords !== null &&
        sourcesSelectionCriteria !== null &&
        searchMethod !== null &&
        selectionProcess !== null; 
    }

function isProtocolPartThreeFinished(response:  Protocol) {
    const { researchQuestions, analysisAndSynthesisProcess } = response;
    return researchQuestions !== null &&
           analysisAndSynthesisProcess !== null;
    }

function isSelectionProcessFinished(response:  StudyReview[]) { 
  for(let i = 0; i<response.length; i++){
    if(response[i].extractionStatus === 'selected' || response[i].extractionStatus === 'included'){
      return true;
    }
    if(response[i].extractionStatus === 'pending' || response[i].extractionStatus === 'unreviewed'){
      return true;
    }
  }
    return false;
}

function isExtractionProcessFinished(response:  StudyReview[]) { 
    for (let i = 0; i < response.length; i++) {
      if (response[i].extractionStatus !== "Finished") {
        return false;
      }
    }
    return true;
} // i couldn't find what are the possible states that extractionStatus can have, so this may need to be changed later;
// also, why isn't this an enum??





export default async function goToUnfinishedSystematicReviewPart(revisionId: string) {
    const protocolData = await useFetchProtocol(revisionId);
    const studiesData = await useFetchAllStudies(revisionId);

    
    if(!isProtocolPartOneFinished(protocolData)) {
        window.location.href = `http://localhost:5173/#/newReview/protocol/${revisionId}`;
      }

      else if (isPicocInitialized(protocolData) && !isPicocFinished(protocolData)){
        window.location.href = `http://localhost:5173/#/newReview/protocol/${revisionId}`;
      }


      else if (!isProtocolPartTwoFinished(protocolData)) {
                  window.location.href = `http://localhost:5173/#/newReview/protocolpartTwo/${revisionId}`;
                }
                
      else if (!isProtocolPartThreeFinished(protocolData)) {
        window.location.href = `http://localhost:5173/#/newReview/protocolpartThree/${revisionId}`;
      }
        
      else if(!isSelectionProcessFinished(studiesData)) {
       window.location.href = ` http://localhost:5173/#/newReview/selection`;
      }
      else if (!isExtractionProcessFinished(studiesData)) window.location.href = `http://localhost:5173/#/newReview/extraction`;
      else window.location.href = `http://localhost:5173/#/newReview/finalization`;
}