import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import {
  adminEmailState,
  apiHostState,
  congsListState,
  lockRoleState,
  visitorIDState,
} from "../states/main";
import {
  appMessageState,
  appSeverityState,
  appSnackOpenState,
} from "../states/notification";
import { handleAdminLogout } from "../utils/admin";

const chkRoleStyles = {
  ".MuiFormControlLabel-label": { fontSize: "14px" },
  minWidth: "260px",
};

const CongregationUserRole = ({ member, cong_id }) => {
  let abortCont = useMemo(() => new AbortController(), []);

  const [lockRole, setLockRole] = useRecoilState(lockRoleState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setCongs = useSetRecoilState(congsListState);

  const adminEmail = useRecoilValue(adminEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const [roles, setRoles] = useState(member.cong_role);
  const [tmpRoles, setTmpRoles] = useState(member.cong_role);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLMMO, setIsLMMO] = useState(false);
  const [isViewMeetingSched, setIsViewMeetingSched] = useState(false);

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleSetAdmin = (checked) => {
    if (!isProcessing) {
      if (lockRole && isEditing) {
        setIsAdmin(checked);
      } else if (!lockRole) {
        setIsAdmin(checked);
      }
    }
  };

  const handleSetLMMO = (checked) => {
    if (!isProcessing) {
      if (lockRole && isEditing) {
        setIsLMMO(checked);
      } else if (!lockRole) {
        setIsLMMO(checked);
      }
    }
  };

  const handleSetViewMeetingSched = (checked) => {
    if (!isProcessing) {
      if (lockRole && isEditing) {
        setIsViewMeetingSched(checked);
      } else if (!lockRole) {
        setIsViewMeetingSched(checked);
      }
    }
  };

  const handleChangeRole = async () => {
    try {
      setIsProcessing(true);

      const reqPayload = {
        user_uid: member.user_uid,
        user_role: tmpRoles,
      };

      if (apiHost !== "") {
        const response = await fetch(
          `${apiHost}api/admin/congregations/${cong_id}/update-role`,
          {
            signal: abortCont.signal,
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              email: adminEmail,
              visitorid: visitorID,
            },
            body: JSON.stringify(reqPayload),
          }
        );

        if (response.status === 200) {
          const newCongs = await response.json();
          setCongs(newCongs);
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        } else if (response.status === 403) {
          await handleClearAdmin();
        } else {
          const data = await response.json();
          setIsProcessing(false);
          setAppMessage(data.message);
          setAppSeverity("warning");
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity("error");
      setAppSnackOpen(true);
    }
  };

  useEffect(() => {
    setIsAdmin(false);
    setIsLMMO(false);

    if (roles) {
      for (let i = 0; i < roles?.length; i++) {
        if (roles[i] === "admin") {
          setIsAdmin(true);
        } else if (roles[i] === "lmmo") {
          setIsLMMO(true);
        } else if (roles[i] === "view_meeting_schedule") {
          setIsViewMeetingSched(true);
        }
      }
    }
  }, [roles]);

  useEffect(() => {
    let newRoles = [];

    if (isAdmin) {
      newRoles.push("admin");
    }
    if (isLMMO) {
      newRoles.push("lmmo");
    }
    if (isViewMeetingSched) {
      newRoles.push("view_meeting_schedule");
    }

    setTmpRoles(newRoles);
  }, [isAdmin, isLMMO, isViewMeetingSched]);

  useEffect(() => {
    if (roles) {
      const isSame =
        roles.length === tmpRoles.length &&
        roles.every((value, index) => value === tmpRoles[index]);

      setIsEditing(!isSame);
      setLockRole(!isSame);
    }
  }, [roles, setLockRole, tmpRoles]);

  useEffect(() => {
    setRoles(member.cong_role);
    setTmpRoles(member.cong_role);
  }, [member]);

  useEffect(() => {
    return () => abortCont.abort();
  }, [abortCont]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          Congregation roles
        </Typography>

        {member.global_role === "vip" && (
          <>
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "10px",
                marginBottom: "15px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={(e) => handleSetAdmin(e.target.checked)}
                    sx={{ padding: "2px" }}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                }
                sx={chkRoleStyles}
                label="Adminstrator"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isLMMO}
                    onChange={(e) => handleSetLMMO(e.target.checked)}
                    sx={{ padding: "2px" }}
                  />
                }
                sx={chkRoleStyles}
                label="Life and Ministry Meeting Overseer"
              />
            </FormGroup>
          </>
        )}

        {member.global_role === "pocket" && (
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              marginLeft: "10px",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isViewMeetingSched}
                  onChange={(e) => handleSetViewMeetingSched(e.target.checked)}
                  sx={{ padding: "2px" }}
                />
              }
              sx={chkRoleStyles}
              label="View meeting schedules"
            />
          </FormGroup>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isEditing && (
          <>
            {isProcessing && (
              <CircularProgress disableShrink color="secondary" size={"30px"} />
            )}

            {!isProcessing && (
              <IconButton onClick={handleChangeRole} aria-label="save">
                <SaveIcon sx={{ color: "#2874A6" }} />
              </IconButton>
            )}
          </>
        )}
        {isSuccess && <CheckCircleIcon color="success" size={"30px"} />}
      </Box>
    </Box>
  );
};

export default CongregationUserRole;
