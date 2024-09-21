import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { About, Contact, Home, Projects } from "./pages";

import SciCompetitions from "./pages/Science/sci_competitions";
import SciMain from "./pages/Science/Science_Main";
import SciWorkshops from "./pages/Science/sci_workshops";
import SciProjects from "./pages/Science/sci_projects";
import TechMain from "./pages/Technology/Tech_Main";
import TechWorkshops from "./pages/Technology/tech_workshops";
import TechCompetitions from "./pages/Technology/tech_competitions";
import TechProjects from "./pages/Technology/tech_projects";
import EngMain from "./pages/Engineering/eng_Main";
import EngWorkshops from "./pages/Engineering/eng_workshops";
import EngCompetitions from "./pages/Engineering/eng_competitions";
import EngProjects from "./pages/Engineering/eng_projects";
import ArtWorkshops from "./pages/Arts/art_workshops";
import ArtCompetitions from "./pages/Arts/art_competitions";
import ArtProjects from "./pages/Arts/art_projects";
import ArtMain from "./pages/Arts/art_main";
import MathWorkshops from "./pages/Maths/math_workshops";
import MathCompetitions from "./pages/Maths/math_competitions";
import MathProjects from "./pages/Maths/math_projects";
import MathMain from "./pages/Maths/math_main";
import Dashboard from "./pages/Dashboard";
import IntroductionCards from "./pages/IntroductionRoute";

const App = () => {
  return (
    <main className='bg-slate-300/20'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/*'
            element={
              <>
                <Routes>
                  <Route path='/about' element={<About />} />
                  <Route path='/science' element={<SciMain />} />
                  <Route path='/technology' element={<TechMain />} />
                  <Route path='/engineering' element={<EngMain />} />
                  <Route path='/arts' element={<ArtMain />} />
                  <Route path='/maths' element={<MathMain />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path = "/science/workshops" element={<SciWorkshops/>}></Route>
                  <Route path = "/science/competitions" element={<SciCompetitions/>}></Route>
                  <Route path = "/science/projects" element={<SciProjects/>}></Route>
                  <Route path = "/technology/workshops" element={<TechWorkshops/>}></Route>
                  <Route path = "/technology/competitions" element={<TechCompetitions/>}></Route>
                  <Route path = "/technology/projects" element={<TechProjects/>}></Route>
                  <Route path = "/engineering/workshops" element={<EngWorkshops/>}></Route>
                  <Route path = "/engineering/competitions" element={<EngCompetitions/>}></Route>
                  <Route path = "/engineering/projects" element={<EngProjects/>}></Route>
                  <Route path = "/arts/workshops" element={<ArtWorkshops/>}></Route>
                  <Route path = "/arts/competitions" element={<ArtCompetitions/>}></Route>
                  <Route path = "/arts/projects" element={<ArtProjects/>}></Route>
                  <Route path = "/maths/workshops" element={<MathWorkshops/>}></Route>
                  <Route path = "/maths/competitions" element={<MathCompetitions/>}></Route>
                  <Route path = "/maths/projects" element={<MathProjects/>}></Route>
                  <Route path = "/introduction-cards" element={<IntroductionCards/>}></Route>

                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
