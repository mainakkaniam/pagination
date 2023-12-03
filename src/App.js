import { Autocomplete, Button, Checkbox, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import { Delete,Edit, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight} from '@mui/icons-material';
import { useEffect,useState } from 'react';
import { Dropdown } from 'rsuite';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("name");
  const [searchText, setSearchText] = useState("");
  const headers = ["Name", "Email", "Role", "Actions"];

  useEffect(() => {
    async function getData() {
      const raw_data = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      const info = await raw_data.json();
      setData(info)
    }
    getData();
  }, []);

  const handleSelectedPage = (selectedPage) => {
    if (page !== selectedPage)
      setPage(selectedPage)
  }
  const handleDeleteRow = (id) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
  };
  

  const handleDeleteSelected = () => {
    const newData = [...data];
    const filteredDataIds = getFilteredData()
      .slice((page - 1) * 10, Math.min(page * 10, getFilteredData().length))
      .filter(item => item.isChecked === true)
      .map(item => item.id);
  
    for (let i = newData.length - 1; i >= 0; i--) {
      if (filteredDataIds.includes(newData[i].id)) {
        newData.splice(i, 1);
      }
    }
  
    setData(newData);
  };
  
 
  

  const handlePropertyChange = (e, index, property) => {
    const newData = [...data];
    newData[page * 10 - 10 + index][property] = e.target.value;
    setData(newData);
  }

  const handleCheckbox = (e, id) => {
    const { name, checked } = e.target;
  
    if (name === "selectAll") {
      const newData = [...data];
      const filteredIds = getFilteredData()
      .slice((page - 1) * 10, Math.min(page * 10, getFilteredData().length))
      .map(item => item.id);
      for (let i = 0; i < newData.length; i++) {
        if (filteredIds.includes(newData[i].id)) {
          newData[i].isChecked = checked;
        }
      }
  
      setData(newData);
    } else {
      const newData = [...data];
      const index = newData.findIndex(item => item.id === id);
        newData[index].isChecked = checked;
        setData(newData);
    }
  };
  

  const getFilteredData = () => {
    const filtered = data.filter(item => {
      const propertyValue = item[searchBy].toLowerCase();
      const searchValue = searchText.toLowerCase();
      return propertyValue.startsWith(searchValue);
    });
    return filtered;
  };

   return (
    <div className="Pagination w-screen min-h-screen py-[5vh] px-[5vw] flex flex-col gap-y-[5vh]">
      <div className="search-deleteBulk flex justify-between items-center">
         <div className="search_searchtype flex gap-x-3">
           <div className="search flex items-center">
             <input type="text" className="w-[300px] outline-none text-[20px] py-[4px] px-[10px]" placeholder={`Search by ${searchBy}`}
               onChange={(e) => {
                 if (e.target.value.length > 0)
                   setPage(1);
                 setSearchText(e.target.value);
               }} />
           </div>
           <div className="searchtype">
           <Dropdown title="SEARCH BY:">
               <style>
                 {
                   `
                   .rs-dropdown-toggle{
                    background-color:#ff584f;
                    color:white;
                    font-family: "Roboto","Helvetica","Arial",sans-serif;
                    font-weight: 500;
                    font-size: 0.875rem;
                    line-height: 1.75;
                    letter-spacing: 0.02857em;
                   }

                   .rs-dropdown-menu{
                    width:100%;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                   }
                   `
                 }
               </style>
               <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="name"
                 name="radio-buttons-group"
                 onChange={(e)=>{setSearchBy(e.target.value)}}
  >
    <FormControlLabel value="name" control={<Radio />} label="name" />
    <FormControlLabel value="email" control={<Radio />} label="email" />
    <FormControlLabel value="role" control={<Radio />} label="role" />
  </RadioGroup>
    
  </Dropdown>
           </div>
        </div>
         <IconButton sx={{ backgroundColor: "#ff584f", color: "white" }}
           disabled={!getFilteredData().slice((page - 1) * 10, Math.min(page * 10, getFilteredData().length)).some((item) => item?.isChecked === true)}
           onClick={handleDeleteSelected}>
          <Delete/>
        </IconButton>  
       </div>
       <p className="text-xl text-[#ff584f]">This project has inline editing enabled</p>
       <div className="table sm:text-[20px]">
       <table>
      <thead>
             <td>
               <Checkbox
                 name="selectAll"
                 checked={! getFilteredData().slice((page - 1) * 10, Math.min(page * 10, getFilteredData().length)).some((item) => item?.isChecked !== true)}
                 onChange={(e) => {
                   handleCheckbox(e);
                 }}
                 sx={{
                        color:"#ff584f",
                        '&.Mui-checked': {
                        color:"#ff584f" ,
                         }
                    }} />
             </td>
             {
               headers.map((header) => (<td>{header}</td>))
             }
      </thead>
      <tbody>
             {
               getFilteredData().slice(page*10-10,Math.min(page*10,getFilteredData().length)).map((item,index) => (
                 <>
                   <tr>
                     <td>
                       {/** ||false is an important part else it wouldnt work */}
                       <Checkbox
                         checked={item?.isChecked||false}
                         onChange={(e) => {
                           handleCheckbox(e, item.id);
                       }}
                       sx={{
                          color:"#ff584f" ,
                         '&.Mui-checked': {
                          color:"#ff584f",
                          }
                       }} />
                     </td>
                     <td><input type="text" value={item.name}
                       className="border-none bg-transparent outline-none w-fit text-center"
                       onChange={(e) => {
                       handlePropertyChange(e, index, "name");
                     }}/></td>
                     <td><input type="text" value={item.email}
                       className="border-none bg-transparent outline-none w-fit text-center"
                       onChange={(e) => {
                       handlePropertyChange(e, index, "email");
                     }}/></td>
                     <td><input type="text" value={item.role}
                       className="border-none bg-transparent outline-none w-fit text-center"
                       onChange={(e) => {
                       handlePropertyChange(e,index,"role")
                     }}/></td>
                     <td>
                       <div className="flex w-full justify-evenly">
                         <IconButton sx={{backgroundColor:"#ff584f",color:"white"}}
                           onClick={() => {
                             handleDeleteRow(item.id);
                         }}>
                           <Delete/>
                         </IconButton>  
                       </div>
                     </td>
                   </tr>
                 </>
               ))
             }

      </tbody>
    </table>
       </div>
       <div className="last-line flex justify-between items-center text-xl">
         <div className="selected">
           0 out of {getFilteredData().length} items selected
         </div>
         <div className="page-change flex gap-x-2 justify-center items-center">
           <div className="page-number text-xl">
             Page {page} selected
           </div>
           <div className="page-change-icons flex gap-x-2">
             <IconButton
               className="hover:text-black"
               sx={{ backgroundColor: "#ff584f", color: "white" }}
               disabled={page===1}
               onClick={() => {
               handleSelectedPage(1);
           }}>
          <KeyboardDoubleArrowLeft/>
             </IconButton>  
             <IconButton
               className="hover:text-black"
               sx={{ backgroundColor: "#ff584f", color: "white" }}
               disabled={page===1}
               onClick={() => {
               handleSelectedPage(page-1)
             }}>
          <KeyboardArrowLeft/>
             </IconButton> 
             {
               [...Array(Math.ceil(getFilteredData().length/10))].map((_, index) => (
                 <Button
                   className={page === (index + 1) ? "" : "hover:text-black"}
                   sx={{
                     backgroundColor: page === (index + 1) ? "white" : "#ff584f",
                     color: page === (index + 1) ? "#ff584f" : "white",
                     paddingX: "3px",
                     minWidth: "40px",
                     border: page === (index + 1) ? " 1px solid #ff584f" : "none"
                   }} onClick={() => {
                   handleSelectedPage(index + 1);
                }}>
                {index+1}
                </Button> 
               ))
             } 
             <IconButton
               className="hover:text-black"
               sx={{ backgroundColor: "#ff584f", color: "white" }}
               disabled={page===Math.ceil(getFilteredData().length/10)}
               onClick={() => {
               handleSelectedPage(page + 1);
             }}>
          <KeyboardArrowRight/>
             </IconButton>  
             <IconButton
             className="hover:text-black"
               sx={{
               backgroundColor: "#ff584f",
               color: "white",
             }}
               disabled={page===Math.ceil(getFilteredData().length/10)}
               onClick={() => {
               handleSelectedPage(Math.ceil(getFilteredData().length/10));
             }}>
          <KeyboardDoubleArrowRight/>
        </IconButton>  
           </div>
         </div>
       </div>
    </div>
  );
}

export default App;
