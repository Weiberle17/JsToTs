import {Box, CircularProgress, Typography} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {useEffect, useState} from "react";

const StepSuccess = ({boxStyle}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return (
    <>
      <Box
        sx={boxStyle}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {
              loading ? <CircularProgress color='primary' size={100} sx={{margin: 3}}/> :
                <CheckIcon sx={{color: '#00965E', fontSize: 150}}/>
            }
            <Typography variant="h5" sx={{color: loading ? 'primaryColor' : '#00965E'}}>
              Antrag {loading ? 'wird' : 'erfolgreich'} abgeschickt
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default StepSuccess
