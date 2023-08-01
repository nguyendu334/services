Dim innohep
Dim KPR, PACK, CABLE_RESUFT,INPUTTIME, OUTPUTTIME, SoluongVit18S,SoluongVit4S, NGPOS
If SmartTags("LINE_AUTO").Value Then
	Dim BITS 
	Set BITS = GROUPSMARTTAG("ES050_ENDSTATION,ES050_PCENDSTATION")
	If BITS("ES050_ENDSTATION").Value Then
		If BITS("ES050_PCENDSTATION").Value = False Then'If SmartTags("ES050_PLCTRIGER_CHECKPACK").Value Then
				'get dll object
				Set innohep =HMIRuntime.Screens("MYABC").ScreenItems("abc")
				innohep.SetConnection(SmartTags("ConnectionString").Value)
				'check code
				
					HMIRuntime.Trace  vbCrLf & "============ES050 END: " & FormatDateTime(Now()) & "============" & vbCrLf
				HMIRuntime.Trace FormatDateTime(Now()) & "1. GET PACK,TOP Codes" & vbCrLf
				'=================================
				Dim WORDS, TEXT,MK
				TEXT = "ES050_CODE_PACK_SAVE"
				TEXT = TEXT &"," &"ES050_IN_YYYY,ES050_IN_MM,ES050_IN_DD,ES050_IN_HH,ES050_IN_mm(1),ES050_IN_ss,ES050_OUT_YYYY,ES050_OUT_MM,ES050_OUT_DD,ES050_OUT_HH,ES050_OUT_mm(1),ES050_OUT_ss"
				TEXT = TEXT &"," &"ES050_Soluong_18SScrew"
				TEXT = TEXT &"," &"ES050_Soluong_4SScrew"
				TEXT = TEXT &"," &"ES050_RESUFT"
				For MK = 1 To 16 Step 1
					TEXT = TEXT &"," &"ES050_RESUFT_18SSCREW_" & CStr(MK)
					TEXT = TEXT &"," &"ES050_RESUFT_4SSCREW_" & CStr(MK)
				Next
				
				
				
				
				Set WORDS = GROUPSMARTTAG(TEXT) 
				
				
				
					PACK = WORDS("ES050_CODE_PACK_SAVE").Value
					INPUTTIME = NGAYTHANGNAM(WORDS("ES050_IN_YYYY").Value,WORDS("ES050_IN_MM").Value,WORDS("ES050_IN_DD").Value,WORDS("ES050_IN_HH").Value,WORDS("ES050_IN_mm(1)").Value,WORDS("ES050_IN_ss").Value)
					OUTPUTTIME = NGAYTHANGNAM(WORDS("ES050_OUT_YYYY").Value,WORDS("ES050_OUT_MM").Value,WORDS("ES050_OUT_DD").Value,WORDS("ES050_OUT_HH").Value,WORDS("ES050_OUT_mm(1)").Value,WORDS("ES050_OUT_ss").Value)
					SoluongVit18S = WORDS("ES050_Soluong_18SScrew").Value
					SoluongVit4S = WORDS("ES050_Soluong_4SScrew").Value
				'==================================
				'DA XONG PACK, SAVE LAI
					
					
					
					HMIRuntime.Trace FormatDateTime(Now()) & "2. SAVE PACK: " & PACK & "....."
					If PACK = "" Then
						HMIRuntime.Trace "============ES050: PACKCODE NULL============" & vbCrLf
						SmartTags("ES050_ENDSTATION") = False
					Else
			
					
					
					If WORDS("ES050_RESUFT").Value Then 
						CABLE_RESUFT ="OK"
					Else 
						CABLE_RESUFT ="NG"
					End If
		HMIRuntime.Trace FormatDateTime(Now()) & "Appreance_Check_Add: " &PACK & innohep.Appreance_Check_Add(PACK, CABLE_RESUFT, "ES050", "", "", "", "", "", "", "", INPUTTIME, OUTPUTTIME, "") & vbCrLf
				HMIRuntime.Trace FormatDateTime(Now()) & "          SL_Screw18S: " &SoluongVit18S&"-PACK:" &PACK & innohep.Appreance_Check_Additional_Add(PACK, "ES050", CABLE_RESUFT, "18SBOLTS_QTY", SoluongVit18S, INPUTTIME, OUTPUTTIME, "") & vbCrLf
				HMIRuntime.Trace FormatDateTime(Now()) & "          SL_Screw4S: " &SoluongVit4S&"-PACK:" &PACK & innohep.Appreance_Check_Additional_Add(PACK, "ES050", CABLE_RESUFT, "4SBOLTS_QTY", SoluongVit4S, INPUTTIME, OUTPUTTIME, "") & vbCrLf
		Dim i
		If CABLE_RESUFT ="NG" Then
								If SoluongVit18S >16 Then
									HMIRuntime.Trace FormatDateTime(Now()) & "         SLVIT18S too lage: " & SoluongVit18S & " > 16 ....."& vbCrLf
									SoluongVit18S = 16
									
								End If
								If SoluongVit4S >16 Then
									HMIRuntime.Trace FormatDateTime(Now()) & "         SLVIT4S too lage: " & SoluongVit4S & " > 16 ....."& vbCrLf
									SoluongVit4S = 16
									
								End If
			
			
			
			For i = 1 To SoluongVit18S Step 1
				NGPOS = WORDS("ES050_RESUFT_18SSCREW_" & CStr(i)).Value
				If NGPOS = 0 Then
					HMIRuntime.Trace FormatDateTime(Now()) & "          NG POSITION: " & CStr(i) &"-PACK:" &PACK & innohep.Appreance_Check_Additional_Add(PACK, "ES050", CABLE_RESUFT, "18S NG POSITION", NGPOS, INPUTTIME, OUTPUTTIME, "") & vbCrLf
				End If
			Next
			
			For i = 1 To SoluongVit4S Step 1
				NGPOS = WORDS("ES050_RESUFT_4SSCREW_" & CStr(i)).Value
				If NGPOS = 0 Then
					HMIRuntime.Trace FormatDateTime(Now()) & "          NG POSITION: " & CStr(i) &"-PACK:" &PACK & innohep.Appreance_Check_Additional_Add(PACK, "ES050", CABLE_RESUFT, "4S NG POSITION", NGPOS, INPUTTIME, OUTPUTTIME, "") & vbCrLf
				End If
			Next
		End If
				
				If innohep.Traceability_Add(PACK, "", "", "ES050", "", "", CABLE_RESUFT, "", "", "", 99, 99, "", INPUTTIME, OUTPUTTIME, "","MAIN") = "Y" Then
						'SmartTags("ES050_PLCTRIGER_CHECKPACK") = False 
						SmartTags("ES050_PCENDSTATION") = True
						HMIRuntime.Trace FormatDateTime(Now()) & PACK &"---OK" & vbCrLf
						
																								'==========================================
							Dim Order_ID
								If CABLE_RESUFT = "NG" Then
									Order_ID = innohep.GetOrderST()
									If(Order_ID <>"" And Order_ID <> "NG") Then
										innohep.SetOrderInModule PACK, Order_ID, "NG"
									End If
								End If
								'=======================================
					PUTDataToVinfast innohep,SmartTags("VF_URL_PACKdata").Value,"PUT", PACK,"ES050"
						
				Else
					HMIRuntime.Trace FormatDateTime(Now()) & "NG, PLZ CHECK SYSTEM" & vbCrLf
				End If
				SmartTags("ES050_DIS_PACKCODE_SAVE") = PACK
				SmartTags("ES050_DIS_OUTPUTDATE") = OUTPUTTIME
				SmartTags("ES050_DIS_INPUTDATE") = INPUTTIME
				
				
					End If
					
				
		Else 
		HMIRuntime.Trace "============ES050-END CHECK PACK CODE FIRST, PLZ CHECK============" & vbCrLf
		End If
	End If
Else
	'RESET BIT CHECK CUA PLC
	HMIRuntime.Trace "============ES050-END IS MANUAL MODE============" & vbCrLf
End If