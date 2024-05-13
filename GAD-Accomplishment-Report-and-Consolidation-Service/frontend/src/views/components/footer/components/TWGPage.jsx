import React from 'react'
import NeutralButton from '../../buttons/NeutralButton'
import BgImage from '../../../../TMP/image18.jpg'

export default function TWGPage() {
    const handleNavigation = () => {
        window.location.href = '/';
      };

      const HeaderStyle = 'font-bold my-1 font-black'
      const colStyle = 'flex flex-col-2 justify-center'
      const listStyle = 'mx-2 font-bold'
      
  return (
    <div className='flex flex-col text-center'>
        <div className='absolute -z-20 h-screen overflow-hidden'>
            <img src={BgImage} alt="gackgroundimage" />
        </div>
        <div className='absolute -z-10 h-screen w-screen overflow-hidden opacity-45 bg-white'>

        </div>
        <div>
            <div className={HeaderStyle}>
                GAD Director
            </div>
            <div>
                Estrellita M. Daclan
            </div>

            <div>
                <div className={HeaderStyle}>
                    Focal Point System Technical Working Group (GFPS-TWG) Members
                </div>

                <div className={colStyle}>
                <div className={listStyle}>
                        <ul>
                            <li>Gretchen Gaye C. Ablaza</li>
                            <li>Frael U. Aquino</li>
                            <li>Stanley F. Anongos Jr.</li>
                            <li>Melvin John M. Aromin</li>
                            <li>Veronica Reina E. Aromin</li>
                            <li>Gigy G. Banes</li>
                            <li>Bryan C. Bangnan</li>
                            <li>Rex John G. Bawang</li>
                            <li>Carolyn C. Biteng</li>
                            <li>Susan P. Buasen-Ocasen</li>
                        </ul>
                    </div>
                    <div className={listStyle}>
                        <ul>
                            <li>Martina A. Deponio</li>
                            <li>Donguiz, Renebeth G.</li>
                            <li>Leonardo D. Dumalhin</li>
                            <li>Odelon C. Dulay</li>
                            <li>Ramon C. Fiangaan Jr.</li>
                            <li>Imelda B. Galinato</li>
                            <li>Michelle D. Gamboa</li>
                            <li>Amelia M. Kimeu</li>
                            <li>Lauren P. Kipaan</li>
                            <li>Adamson N. Labi</li>
                        </ul>
                    </div>
                    <div className={listStyle}>
                        <ul>
                            <li>Elizabeth T. Dom-Ogen</li>
                            <li>Maricris P. Lad-Ey-Neyney</li>
                            <li>Anna Cris L. Langaoan</li>
                            <li>Elizabeth A. Lascano</li>
                            <li>Jocelyn L. Mauting</li>
                            <li>Vicente G. Panagan Jr.</li>
                            <li>Imelda G. Parcasio</li>
                            <li>Raymundo H. Pawid Jr.</li>
                            <li>Chrisando P. Paza</li>
                            <li>Jeftee Ben B. Pinos-An</li>
                        </ul>
                    </div>
                    <div className={listStyle}>
                        <ul>
                            <li>Florence V. Poltic</li>
                            <li>Marjorie C. Ricardo</li>
                            <li>Loretta C. Romero</li>
                            <li>Freda Kate D. Samuel</li>
                            <li>Alma D. Santiago</li>
                            <li>Myrna B. Sison</li>
                            <li>Constantino T. Sudaypan Sr.</li>
                            <li>Marlon S. Tabdi</li>
                            <li>Jude L. Tayaben</li>
                            <li>Donato R. WanawanJr.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={colStyle}>
                <div>
                    <div className={HeaderStyle}>
                        BSU Bokod Campus
                    </div>

                    <div className={listStyle}>
                        <ul>
                            <li>Rachelle B. Kiong - BSU Bokod Campus Focal Person</li>
                            <li>Rowena P. Viray - GFPS-TWG Member</li>
                            <li>Jezreel A. Afidchao - GFPS-TWG Member</li>
                            <li>Librado C. Matias - GFPS-TWG Member</li>
                            <li>Chester B. Esnara - GFPS-TWG Member</li>
                        </ul>
                    </div>

                </div>

                <div>
                    <div className={HeaderStyle}>
                        BSU Buguias Campus
                    </div>

                    <div className={listStyle}>
                        <ul>
                            <li>Neivalyn B. Labenio - BSU Bokod Campus Focal Person</li>
                            <li>Melody C. Domalti - GFPS-TWG Member</li>
                            <li>Darwin P. Gayaso - GFPS-TWG Member</li>
                            <li>Julius M. Abyado - GFPS-TWG Member</li>
                            <li>Luncia B. Bosilo - GFPS-TWG Member</li>
                            <li>Jezebel B. Changilan - GFPS-TWG Member</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        <div className='sticky bottom-0'>
          {/* Button to go back to the main page */}
          <NeutralButton label={'Back to Main Page'} onClick={handleNavigation} />
        </div>
    </div>
  )
}
