//
//  ScienceHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

class ScienceHomeRouter {
    
    func makeStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.SCIENCE).configureView()
    }
    
    func makeTestView() -> some View {
        return DailyStudyView(subject: SUBJECT.SCIENCE).configureView()
    }
}
