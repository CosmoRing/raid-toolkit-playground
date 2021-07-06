import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFoodRankResume } from '../viewmodels/interfaces/foodRankResume';

@Component({
  selector: 'app-resume-info-dialog',
  templateUrl: './resume-info-dialog.component.html',
  styleUrls: ['./resume-info-dialog.component.scss']
})
export class ResumeInfoDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public resume: IFoodRankResume) { }

  ngOnInit(): void {
  }

}
