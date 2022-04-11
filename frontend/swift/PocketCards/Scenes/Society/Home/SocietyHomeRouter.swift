//
//  SocietyHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

class SocietyHomeRouter {
    func makeStudyiew() -> some View {
        DailyStudyView(subject: SUBJECT.SOCIETY).configureView()
    }

    func makeTestView() -> some View {
        DailyTestView(subject: SUBJECT.SOCIETY).configureView()
    }
}
