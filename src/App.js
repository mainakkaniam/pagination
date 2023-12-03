import { Button, Checkbox, IconButton } from '@mui/material';
import { Delete,Edit, KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight} from '@mui/icons-material';
import { useEffect,useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
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

  const handleDeleteRow = (index) => {
    const newData = [...data];
    newData.splice((page - 1) * 10 + index, 1);
    setData(newData);
  };
  //or  setData(prevData => {
  // return prevData.filter((_, i) => i !== (page - 1) * 10 + index)
  //});
 
  

  const handlePropertyChange = (e, index, property) => {
    const newData = [...data];
    newData[page * 10 - 10 + index][property] = e.target.value;
    setData(newData);
  }

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
  
    if (name === "selectAll") {
      const newData = [...data];
  
      for (let i = (page - 1)*10; i <= Math.min(page*10-1, data.length - 1); i++) {
        newData[i].isChecked = checked;
      }

      setData(newData);
    } else {
      const newData = [...data];
      newData[(page - 1) * 10 + index].isChecked = checked;
      setData(newData);
    }
  };
  

   return (
    <div className="Pagination w-screen h-screen py-[5vh] px-[5vw] flex flex-col gap-y-[5vh]">
      <div className="search-deleteBulk flex justify-between items-center">
        <div className="search flex gap-x-3">
          <input type="text" className="w-[300px] outline-none sm:text-[20px]" placeholder="Search..."/>
          <Button variant="contained" className="search-icon" sx={{backgroundColor:"#ff584f",color:"white"}}>Search</Button>
        </div>
        <IconButton sx={{backgroundColor:"#ff584f",color:"white"}}>
          <Delete/>
        </IconButton>  
      </div>
       <div className="table sm:text-[20px]">
       <table>
      <thead>
             <td>
               <Checkbox
                 name="selectAll"
                 checked={!data.slice(page*10-10,Math.min(page*10-1,data.length-1)).some((item) => item?.isChecked !== true)}
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
               data.slice(page*10-10,Math.min(page*10,data.length)).map((item,index) => (
                 <>
                   <tr>
                     <td>
                       {/** ||false is an important part else it wouldnt work */}
                       <Checkbox
                         checked={item?.isChecked||false}
                         onChange={(e) => {
                           handleCheckbox(e, index);
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
                             handleDeleteRow(index);
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
       <div className="last-line flex justify-between items-center">
         <div className="selected">
           0 out of {data.length} items selected
         </div>
         <div className="page-change flex gap-x-2 justify-center items-center">
           <div className="page-number">
             page {page} selected
           </div>
           <div className="page-change-icons flex gap-x-2">
             <IconButton sx={{ backgroundColor: "#ff584f", color: "white" }} onClick={() => {
               handleSelectedPage(1);
           }}>
          <KeyboardDoubleArrowLeft/>
             </IconButton>  
             <IconButton sx={{ backgroundColor: "#ff584f", color: "white" }}
               disabled={page===1}
               onClick={() => {
               handleSelectedPage(page-1)
             }}>
          <KeyboardArrowLeft/>
             </IconButton>  
             {
               [...Array(Math.ceil(data.length/10))].map((_, index) => (
                 <Button sx={{ backgroundColor: "#ff584f", color: "white", paddingX: "3px", minWidth: "40px" }} onClick={() => {
                   handleSelectedPage(index + 1);
                }}>
                {index+1}
                </Button> 
               ))
             } 
             <IconButton sx={{ backgroundColor: "#ff584f", color: "white" }} onClick={() => {
               handleSelectedPage(page + 1);
             }}>
          <KeyboardArrowRight/>
             </IconButton>  
             <IconButton sx={{ backgroundColor: "#ff584f", color: "white" }}
               disabled={page===Math.ceil(data.length/10)}
               onClick={() => {
               handleSelectedPage(Math.ceil(data.length/10));
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
