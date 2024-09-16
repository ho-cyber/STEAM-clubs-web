import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className='cta'>
      <p className='cta-text'>
        Want to learn More? <br className='sm:block hidden' />
        Have a look at the google document 
      </p>
      <Link to='https://docs.google.com/document/d/1KbjmSRHVKfsNLh75twnJjDIZ4LxEyxzpQTkQOQKCcnA/edit?usp=sharing' className='btn'>
        Go
      </Link>
    </section>
  );
};

export default CTA;
