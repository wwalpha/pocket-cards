//
//  SocietyHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

class SocietyHomeRouter {
    
    func makeStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.SOCIETY).configureView()
    }
    
    func makeTestView() -> some View {
        return DailyStudyView(subject: SUBJECT.SOCIETY).configureView()
    }
}
